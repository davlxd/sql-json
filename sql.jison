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
'>='                   return 'COMPARISON'
'<='                   return 'COMPARISON'
'>'                    return 'COMPARISON'
'<'                    return 'COMPARISON'
'='                    return 'COMPARISON'
(true|false)\b         return 'BOOLEAN'
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
      { $$ = { type: 'OR', condition: $1, condition_another: $3}; }
    | search_condition AND search_condition
      { $$ = { type: 'AND', condition: $1, condition_another: $3}; }
    | NOT search_condition
      { $$ = { type: 'NOT', condition: $2}; }
    | '(' search_condition ')'
      { $$ = $2; }
    | predicate
    ;

predicate
    : comparison_predicate
      { $$ = { type: 'COMPARISON', predicate: $1}; }
    | between_predicate
      { $$ = { type: 'BETWEEN', predicate: $1}; }
    | like_predicate
      { $$ = { type: 'LIKE', predicate: $1}; }
    ;

comparison_predicate
    : scalar_exp COMPARISON scalar_exp
      { $$ = [$2, $1, $3]; }
    ;

between_predicate
    : scalar_exp NOT BETWEEN scalar_exp AND scalar_exp
      { $$ = [$1, $4, $6]; }
    | scalar_exp BETWEEN scalar_exp AND scalar_exp
      { $$ = ['not', $1, $3, $5]; }
;

like_predicate
    : scalar_exp LIKE atom
      { $$ = [$1, $3]; }
    ;

scalar_exp
    : column_ref
    | atom
    ;

column_ref
    : NAME
      { $$ = ['COLUMN', $1]; }
    ;

atom
    : literal
    ;

literal
    : STRING
      { $$ = $1.replace(/^\'|\'$/g, '').replace(/^\"|\"$/g, ''); }
    | NUM
      { $$ = parseFloat($1); }
    | BOOLEAN
      { $$ = $1.toUpperCase() === 'TRUE' ? true : false; }
    ;

