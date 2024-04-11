(query
 query: (string) @injection.content
 (#set! injection.language SQL)
 (#strip! @injection.content "^\"|\""))
