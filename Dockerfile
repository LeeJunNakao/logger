FROM node:15.8.0
WORKDIR /usr/app
RUN apt-get update && apt-get install git
EXPOSE 5050 
CMD ["/bin/bash"]