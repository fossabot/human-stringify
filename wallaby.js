module.exports = function(w) {
    return {
        testFramework: "jest",
        env: {
            type: "node",
            runner: "node"
        },

        files: [
            "tsconfig.json",
            "tsconfig.test.json",
            "lib/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)",
            "!src/**/*.test.[jt]s?(x)"
        ],

        tests: ["test/**/*.test.[jt]s?(x)"]
    };
};
