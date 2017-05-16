module.exports = {
  rules: {
    // Disable airbnb's no importing devDependencies in our tests
    'import/no-extraneous-dependencies': [
      'error',
      { 
        devDependencies: true,
        optionalDependencies: false,
      }
    ]
  }
}

