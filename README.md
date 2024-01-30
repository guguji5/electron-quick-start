export NODE_TLS_REJECT_UNAUTHORIZED=0

TODO:

- [x] 增加深度控制
- [ ] 增加导出 excel 功能
- [ ] 打包 exe
- [ ] 修改名称和图表

```
An unhandled rejection has occurred inside Forge:
Error: Failed with exit code: 255
Output:
System.UnauthorizedAccessException: Access to the path '/Users/flashcat/.local/share/SquirrelTemp' is denied. ---> System.IO.IOException: Permission denied
   --- End of inner exception stack trace ---
  at System.IO.FileSystem.CreateDirectory (System.String fullPath) [0x00191] in <83a10ac9d03d4b5b9cab686735823828>:0
  at System.IO.DirectoryInfo.Create () [0x00000] in <83a10ac9d03d4b5b9cab686735823828>:0
  at (wrapper remoting-invoke-with-check) System.IO.DirectoryInfo.Create()
  at Squirrel.Utility.GetTempDirectory (System.String localAppDirectory) [0x00032] in <1ffb1a5dca5b4f2f93386cec56fd9ec2>:0
  at Squirrel.Utility.WithTempDirectory (System.String& path, System.String localAppDirectory) [0x00006] in <1ffb1a5dca5b4f2f93386cec56fd9ec2>:0
  at Squirrel.ReleasePackage.CreateReleasePackage (System.String outputFile, System.String packagesRootDir, System.Func`2[T,TResult] releaseNotesProcessor, System.Action`1[T] contentsPostProcessHook) [0x00122] in <1ffb1a5dca5b4f2f93386cec56fd9ec2>:0
  at Squirrel.Update.Program.Releasify (System.String package, System.String targetDir, System.String packagesDir, System.String bootstrapperExe, System.String backgroundGif, System.String signingOpts, System.String baseUrl, System.String setupIcon, System.Boolean generateMsi, System.Boolean packageAs64Bit, System.String frameworkVersion, System.Boolean generateDeltas) [0x00214] in <1ffb1a5dca5b4f2f93386cec56fd9ec2>:0
  at Squirrel.Update.Program.executeCommandLine (System.String[] args) [0x00116] in <1ffb1a5dca5b4f2f93386cec56fd9ec2>:0
  at Squirrel.Update.Program.main (System.String[] args) [0x00113] in <1ffb1a5dca5b4f2f93386cec56fd9ec2>:0
  at Squirrel.Update.Program.Main (System.String[] args) [0x00006] in <1ffb1a5dca5b4f2f93386cec56fd9ec2>:0
at ChildProcess.<anonymous> (/Users/flashcat/JavaScript/electron-quick-start/node_modules/electron-winstaller/lib/spawn-promise.js:49:24)
    at ChildProcess.emit (node:events:527:28)
    at ChildProcess.emit (node:domain:475:12)
    at maybeClose (node:internal/child_process:1092:16)
    at Socket.<anonymous> (node:internal/child_process:451:11)
    at Socket.emit (node:events:539:35)
    at Socket.emit (node:domain:475:12)
    at Pipe.<anonymous> (node:net:709:12)
```
