# x.509Check
## What is this project all about?
This project is a small tool based on [nodejs](https://github.com/nodejs) and [Docker](https://github.com/docker). 
Credits also go to the node [x509 Package](https://github.com/Southern/node-x509) that is used for parsing the certificate.

It provides a website where you can upload a [x509](https://en.wikipedia.org/wiki/X.509) certificate and let it pass some checks and get the information stored in it. 

Information that you get from the tool:
* x509 Version number
* Fingerpint
* Hash algorithms
* Subject
* Alternative Names
* Issuer
* Valid from / until
* public key information
  * Fingerprint
  * Algorythm
  * Keysize

The certificate will be checked for:
* Hash algorithm
* Validate from/until
* Selfsigned, External signed
* The length of the public key



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
## usage

After you started the Dockerimage start your web browser and open ```localhost:<port>```. 
Now use the form to select a certificate that you want to check. It has to be Base64 or DER encoded and the extention .cer,.cert,.crt or .pem.
Click on the Upload Button and the tool will show you the results of the validation.

## whats not implemented
There are several enhancements that can be implemented in the future.
* Check the whole certificate chain for trust and validate if an external signed certificate is trustfully.
* add more detailed checks for algorithms and security issues. Evaluate the encryption algorithm and make considerations for quantum calculations.
* Improve UI with mobile responsive design.
* Add possibility to show certificate extensions.
* Add posibility to validate and evaluate a certifiace signing request.
* Add more options to try the whole certification signing and trust process.
