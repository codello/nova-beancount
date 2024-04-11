; Basics
(comment) @comment
(string) @string
(date) @value.number @value.date
(currency) @identifier.constant
(account) @identifier.type
(bool) @value.boolean
((value) @value.boolean
 (#eq? @value.boolean "NULL"))
(at) @operator
(atat) @operator

(number) @value.number
[(plus) (minus) (asterisk) (slash)] @operator
(binary_number_expr
 "(" @operator
 ")" @operator)
(cost_spec
 "{" @operator
 ","? @operator
 "}" @operator)

; Sections
(section
  headline: ((headline) @processing))

; Tags & Links
(tag) @identifier.property
(link) @identifier.decorator

; Metadata
(key_value
 (key) @identifier.key
 ":" @operator)
(key) @identifier.key

; Directives
(option
 "option" @keyword
 key: ((string) @string.key)) @processing

(commodity
 "commodity" @keyword)

(open
 "open" @keyword
 ","? @operator)

(close
 "close" @keyword)

(pushtag
 "pushtag" @keyword)
(poptag
 "poptag" @keyword)

(transaction
 txn: (txn) @keyword
 payee: (payee)? @string
 narration: (narration)? @string)

(pad
 "pad" @keyword)

(balance
 "balance" @keyword)

(price
 "price" @keyword)

(note
 "note" @keyword)

(document
 "document" @keyword)

(event
 "event" @keyword
 type: (string) @identifier.variable)

(query
 "query" @keyword)

(custom
 "custom" @keyword)

(pushmeta
 "pushmeta" @keyword)
(popmeta
 "popmeta" @keyword)

(plugin
 "plugin" @keyword)

(include
 "include" @keyword)
