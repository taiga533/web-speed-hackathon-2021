module.exports = (api) => {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: '3',
          modules: 'commonjs',
          useBuiltIns: 'usage',
          targets: ['last 2 Chrome versions'],
        },
      ],
      [
        '@babel/preset-react',
        {
          development: api.env('development'),
        },
      ],
    ],
  };
};
