((section (headline (item) @name)) @subtree
 (#set! role bookmark)
 (#set! scope.byLine))

(open (account) @name @subtree
 (#set! role type))

(include ((string) @name @subtree
          (#set! role file)
          (#strip! @name "^\"|\"")))

((tag) @name @subtree
 (#set! role tag))

((link) @name @subtree
 (#set! role property))
