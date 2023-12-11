Hey, Sai Vishnu here

So the issue was that I tried to use PutObjectCommand inside s3.upload() [as per the tutorial] from `@aws-sdk/client-s3` but it wasn't uploading at all. I used to get an error that s3.upload() was not defined. So i saw this thing in stackoverflow that s2.send() can be used. So I used it and it uploaded the file to the bucket but the URL it returned was undefined. and it gave a warning.

Warning: "Are you using a Stream of unknown length as the Body of a PutObject request? Consider using Upload instead from @aws-sdk/lib-storage." 
Based on a Github Issue, I tried to add the ContentLength property to the PutObjectCommand. That warning vanished but the upload would take forever and stop after a timeout.


Then I moved it to Upload from `@aws-sdk/lib-storage`. It was uploading the file but again it was of 0kb in size. We tried adding the CORS thing and I 
