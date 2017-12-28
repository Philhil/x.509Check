# x.509Check


## start via docker
- <code>docker build ./ -t \<container-name\></code>
- <code>docker images</code> should contain image
- <code>docker run -p \<Port\>:3000 \<container-name\></code> ausführen
- access via browser localhost:\<Port\>


## save and load docker image
- <code>docker save -o \<path\>/\<filename.tar\><code>
- container should be in specified path as .tar file
- <code>docker load -i \<path\>/\<filename.tar\><code>
- <code>docker images</code> should contain image