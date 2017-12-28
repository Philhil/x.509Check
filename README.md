# x.509Check


## build and start via docker
If you want to start with the latest development state. You can just clone the Git and run Docker.
### build
```shell
    # Clone git to a dir where you want to create your Dockerimage
    git clone https://github.com/Philhil/x.509Check.git
    # Change to dir
    cd x.509Check
    # Build Dockerimage. The String that you use for <container-name> is the name of the image you create.
    docker build ./ -t <container-name>
    # Check if image has been created (the Name should appear in the list)
    docker images
  ```
  
### start
```shell
    # Start created Docker image and map it to an free port on your machine.
    docker run -p <Port>:3000 <container-name>
  ```

Now you can access it via browser localhost:\<Port\>


## save and load docker image
If you want to use the precreated Dockerimage (for example in an offline environment) please follow these Steps.
you can get a precreated image from the [Release Page](https://github.com/Philhil/x.509Check/releases).
### save image
```shell
   # Save existing image to a tar file.
   docker save -o <path>/<filename>.tar <container-name>
```
### import existing Dockerimage from tar file
```shell
   # Change to the directory where you have downloaded the Dockerimage.
   # import tar file to Docker
   docker load -i <path>/<filename>.tar
   # check if file was imported successfully (shoud appear in list).
   docker images
```
