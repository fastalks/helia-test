# helia-test


# 1: addFile
```
helia = await createHelia(
    {
      libp2p,
      blockBrokers:[bitswap()]
    }
  )
const ufs = unixfs(helia)
const fileCID = await ufs.addFile({
   path:filePath,
   content: fileStream,
   mode: 0x755,
   mtime: {
     secs: BigInt(new Date().getMilliseconds()),
     nsecs: 0
   }
 });
```

```
09:40:39:243 Progress: 100.00%
[1] File added with CID: bafybeih7pphyjhjeq5bfr7fw2erxwzuty7zynao2dryce2mp75qpakakca
[1] {
[1]   cid: CID(bafybeih7pphyjhjeq5bfr7fw2erxwzuty7zynao2dryce2mp75qpakakca),
[1]   mode: 1877,
[1]   mtime: { secs: 976n, nsecs: 0 },
[1]   fileSize: 46445552n,
[1]   dagSize: 46445752n,
[1]   localFileSize: 46445552n,
[1]   localDagSize: 46447825n,
[1]   blocks: 46,
[1]   type: 'file',
[1]   unixfs: UnixFS {
[1]     type: 'file',
[1]     data: undefined,
[1]     blockSizes: [
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]       1048576n, 1048576n, 1048576n, 1048576n,
[1]        308208n
[1]     ],
[1]     hashType: undefined,
[1]     fanout: undefined,
[1]     mtime: { secs: 976n, nsecs: 0 },
[1]     _mode: 1877,
[1]     _originalMode: 1877
[1]   }
[1] }
```
# 2: send cid to node2 and get response
```
{ msg: 'ok' }
```

# 3: get cid and cat file
```
 {
[1]   winId: 2,
[1]   fileName: '123.rar',
[1]   remotePath: '/Users/myname/Desktop/test',
[1]   fileSize: 46445552,
[1]   fileType: 'rar',
[1]   cid: 'bafybeih7pphyjhjeq5bfr7fw2erxwzuty7zynao2dryce2mp75qpakakca'
[1] }

```

```
try{
    const ufs = unixfs(helia)
    const cid = CID.parse(cidString)
    const writeStream = fs.createWriteStream(outputPath);
    let receiveBytes = 0;
    for await (const chunk of ufs.cat(cid,{
      signal:AbortSignal.timeout(100 * 1000),
      onProgress:(evt)=>{
        // console.log(evt.detail)
        const { bytesRead, totalBytes, fileSize } = evt.detail
        const bytesReadNumber = Number(bytesRead)
        const totalBytesNumber = Number(totalBytes)
        if (bytesReadNumber && totalBytesNumber) {
          const progress = bytesReadNumber / totalBytesNumber
          console.log(Progress: ${(progress * 100).toFixed(2)}%`);
          const winId = params.winId
          const fileId = cidString
          libp2pNode?.services.pubsub.publish('progress-notice',uint8ArrayFromString(JSON.stringify({winId,fileId,progress})))
        }
        
      }
    })) {
      writeStream.write(chunk);
      receiveBytes += chunk.length;
    }

    writeStream.end();
    console.log('File transfer complete');
  } catch(err) {
    console.log(err)
  }
```
