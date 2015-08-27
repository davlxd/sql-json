%lex

%options case-insensitive

%%

\s+                    /* skip whitespace */
'SELECT'               return 'SELECT'
'*'                    return '*'
'FROM'                 return 'FROM'
'WHERE'                return 'WHERE'
'LIKE'                 return 'LIKE'
'ORDER'                return 'ORDER'
'BY'                   return 'BY'
'WHERE'                return 'WHERE'
'AND'                  return 'AND'
'OR'                   return 'OR'
'NOT'                  return 'NOT'
'('                    return '('
')'                    return ')'
'LIKE'                 return 'LIKE'
[a-zA-Z_][a-zA-Z0-9_]* return 'NAME'
[0-9]+(\.[0-9]+)?      return 'NUM'
\'[^'\n]*\'            return 'STRING'
\"[^'\n]*\"            return 'STRING'
';'                    return ';'
<<EOF>>                return 'EOF'

/lex

%left 'OR'
%left 'AND'
%left 'NOT'
%left '+' '-'
%left '*' '/'
%left '^'
%right '!'
%right '%'
%left UMINUS

%start sql

%% /* language grammar */

sql
    : manipulative_statement EOF
      { return $1; }
    | manipulative_statement ';' EOF
      { return $1; }
    ;

manipulative_statement
    : select_statement
    ;

select_statement
    : SELECT selection table_exp
      { $$ = { type: $1, selection: $2, clause: $3}; }
    ;

selection
    : '*'
    ;

table_exp
    : opt_where_clause
      { $$ = { where: $1}; }
    ;

opt_where_clause
    :
      { $$ = null; }
    | where_clause
    ;

where_clause
    : WHERE search_condition
      { $$ = $2; }
    ;

search_condition
    : search_condition OR search_condition
      { $$ = { type: 'or', condition: $1, condition_another: $3}; }
    | search_condition AND search_condition
      { $$ = { type: 'and', condition: $1, condition_another: $3}; }
    | NOT search_condition
      { $$ = { type: 'not', condition: $2}; }
    | '(' search_condition ')'
      { $$ = $2; }
    | predicate
    ;

predicate
    : like_predicate
      { $$ = { type: 'like', predicate: $1}; }
    ;

like_predicate
    : scalar_exp LIKE atom
      { $$ = [$1, $3]; }
    ;

scalar_exp
    : column_ref
    ;

column_ref
    : NAME
    ;

atom
    : literal
    ;

literal
    : STRING
      { $$ = $1.replace(/^\'|\'$/g, '').replace(/^\"|\"$/g, ''); }
    | NUM
    ;

