# sql-json
A Command Line tool reading JSON file by simplified SQL


## Requirements
Install Jison by run `npm install -g jison`


## How to use
Json file should contain an array whose elements are simple object named `data.json` in current dir:
```
[
  {
    "name": "human",
    "location": "earth",
    "last_physical_contact": "2015-08-28"
  },
  {
    "name": "Martian",
    "location": "mars",
    "upcoming_event": "birthday party"
  }
]

```

Run `jison sql.jison && node index.js`, then you can query data in json by type in sql after prompt `> `


## Example

```
> select *;
AST:
{ type: 'select',
  selection: '*',
  clause: { where: null, orderBy: null } }


+---------+----------+-----------------------+----------------+
| name    | location | last_physical_contact | upcoming_event |
+---------+----------+-----------------------+----------------+
| human   | earth    | 2015-08-28            |                |
+---------+----------+-----------------------+----------------+
| Martian | mars     |                       | birthday party |
+---------+----------+-----------------------+----------------+

>
```


```
> select * where location == 'earth' order by name desc;
AST:
{ type: 'select',
  selection: '*',
  clause:
   { where:
      { type: 'COMPARISON',
        predicate: [ '==', [ 'COLUMN', 'location' ], 'earth' ] },
     orderBy: [ [ 'name', 'desc' ] ] } }


+-------+----------+-----------------------+
| name  | location | last_physical_contact |
+-------+----------+-----------------------+
| human | earth    | 2015-08-28            |
+-------+----------+-----------------------+

>
```

