const current = process.versions?.node;
const engine = process.env?.npm_package_engines_node;

if (current && engine) {
  const [from] = engine.replace(/[>=<]/g, '').split(' ');

  if (from <= current) {
    console.log(
      '\x1b[32m%s\x1b[0m',
      `******* Good to Go with your Node Version: ${current} *******`,
    );
  } else {
    console.log(
      '\x1b[31m%s\x1b[0m',
      `******* Package installation(npm install) or Project startup command(npm start) failed due to Node Version, Please use Node Version ${engine} *******`,
    );
    console.log(
      '\x1b[33m%s\x1b[0m',
      `******* Your current Node Version is: ${current} *******`,
    );
    process.exit(1);
  }
} else {
  console.log(
    '\x1b[31m%s\x1b[0m',
    '******* Something went wrong while checking Node version *******',
  );
  process.exit(1);
}
