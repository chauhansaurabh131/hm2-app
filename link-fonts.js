const fs = require('fs');
const crypto = require('crypto');
const pbxprojPath = 'ios/HappyMilan2.xcodeproj/project.pbxproj';
const fontsDir = 'ios/HappyMilan2/Fonts';
const fonts = fs
  .readdirSync(fontsDir)
  .filter(f => f.endsWith('.ttf') || f.endsWith('.otf'));
let content = fs.readFileSync(pbxprojPath, 'utf8');

// 1. Remove all existing Poppins references
content = content
  .split('\n')
  .filter(line => !line.includes('Poppins-'))
  .join('\n');

const getHashId = str => {
  return crypto
    .createHash('sha1')
    .update(str)
    .digest('hex')
    .slice(0, 24)
    .toUpperCase();
};

const getFileId = name => getHashId('FILE_' + name);
const getBuildId = (name, phase) => getHashId('BUILD_' + name + phase);

// 2. Add FileReferences
let fileRefs = '';
fonts.forEach(font => {
  const id = getFileId(font);
  fileRefs += `\t\t${id} /* ${font} */ = {isa = PBXFileReference; lastKnownFileType = file; name = "${font}"; path = "Fonts/${font}"; sourceTree = "<group>"; };\n`;
});
content = content.replace(
  '/* Begin PBXFileReference section */',
  `/* Begin PBXFileReference section */\n${fileRefs}`,
);

// 3. Add to Groups
const groupRegex =
  /([0-9A-F]{24}) \/\* HappyMilan2 \*\/ = \{\n\t\t\tisa = PBXGroup;\n\t\t\tchildren = \(\n/g;
content = content.replace(groupRegex, match => {
  let children = '';
  fonts.forEach(font => {
    children += `\t\t\t\t${getFileId(font)} /* ${font} */,\n`;
  });
  return match + children;
});

// 4. Collect all build entries and update Resource Phases
let allBuildEntries = '';
const phaseRegex =
  /([0-9A-F]{24}) \/\* Resources \*\/ = \{\n\t\t\tisa = PBXResourcesBuildPhase;\n\t\t\tbuildActionMask = 2147483647;\n\t\t\tfiles = \(\n/g;

content = content.replace(phaseRegex, (match, phaseId) => {
  let files = '';
  fonts.forEach(font => {
    const buildId = getBuildId(font, phaseId);
    const fileId = getFileId(font);
    allBuildEntries += `\t\t${buildId} /* ${font} in Resources */ = {isa = PBXBuildFile; fileRef = ${fileId} /* ${font} */; };\n`;
    files += `\t\t\t\t${buildId} /* ${font} in Resources */,\n`;
  });
  return match + files;
});

content = content.replace(
  '/* Begin PBXBuildFile section */',
  `/* Begin PBXBuildFile section */\n${allBuildEntries}`,
);

fs.writeFileSync(pbxprojPath, content);
console.log('Successfully updated pbxproj with unique IDs');
