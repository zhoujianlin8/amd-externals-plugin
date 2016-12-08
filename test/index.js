
module.exports =  function ({ types: t })) {
  return {
    visitor: {
      // require("TOKEN/lodash")
      CallExpression(path, state) {
        var node = path.node;
        var args = node.arguments || [];
        if (node.callee.name === "require" && args.length === 1 && t.isStringLiteral(args[0])) {
          var src = args[0].value;
          console.log('src',src);
          // Parse options and mutate with first match.
          
          /*if (replace) {
            // Rewrite `require` with a clone of stashed node.
            node.callee = Object.assign({}, replace);

            // Replace module argument with stripped module path.
            args[0].value = mod;
          }*/
        }
      }
    }
  };
}