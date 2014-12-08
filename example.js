var falafel = require('../falafel-tame');

function keyword_example(){
    // var src = 'console.log(beep "boop", "BOOP");';
    var src = 'beep "boop";';

    function isKeyword (id) {
        if (id === 'beep') return true;
    }

    var output = falafel(src, { isKeyword: isKeyword }, function (node) {
        if (node.type === 'UnaryExpression'
        && node.keyword === 'beep') {
            node.update(
                'String(' + node.argument.source() + ').toUpperCase()'
            );
        }
    });
    console.log(output);
}

function array_example(){
    var src = '(' + function () {
        var xs = [ 1, 2, [ 3, 4 ] ];
        var ys = [ 5, 6 ];
        console.dir([ xs, ys ]);
    } + ')()';

    var output = falafel(src, function (node) {
        if (node.type === 'ArrayExpression') {
            node.update('fn(' + node.source() + ')');
        }
    });
    console.log(output);
}

function block_example(){

    var src = 'function(){ server { where.push("server") } client { where.push("client") } }';
    // var src = 'server { }';
    // var src = "if(true){}";

    function isKeyword (id) {
        if (id === 'server' || id === 'client') return 'block';
    }

    function source (xs) {
        if(!xs){ return ""; }
        return xs.map(function (x) { return x.source() }).join('');
    }

    var output = falafel(src, { isKeyword: isKeyword }, function (node) {
        console.log(node.type, " node.source():", node.source());
        console.log(node.type, " source(node.body):", source(node.body));

        if (node.blah === 'server') {
            node.update('if (SERVER) {' + source(node.body) + '}');
        }
        else if (node.blah === 'client') {
            node.update('if (CLIENT) {' + source(node.body) + '}');
        }
    });

    console.log(output);
}

// array_example();
// keyword_example();
block_example();
