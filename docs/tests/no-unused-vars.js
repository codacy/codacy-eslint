//#Patterns: no-unused-vars

var x;

var y = 10;
//#Info: no-unused-vars
y = 5;

//#Info: no-unused-vars
(function(foo) { 
    return 5;
})();

function fact(n) {
    if (n < 2) return 1;
    //#Info: no-unused-vars
    return n * fact(n - 1);
}

alert(x);
