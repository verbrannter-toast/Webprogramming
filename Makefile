.PHONY: docker.build docker.run docker.delete_container docker.stop docker.delete_image

IMAGE := streaming-service
CONTAINER := streaming-service-app
FRONTEND_PORT := 3000
BACKEND_PORT := 5000

docker.build:	
	docker build -t $(IMAGE) .

docker.run:
	docker run -p $(FRONTEND_PORT):$(FRONTEND_PORT) -p $(BACKEND_PORT):$(BACKEND_PORT) --name $(CONTAINER) -d $(IMAGE)

docker.stop:
	docker stop $(CONTAINER)

docker.delete_container:
	docker rm -f $(CONTAINER) || true

docker.delete_image:
	docker rmi $(IMAGE)	

docker.exec:
	docker exec -it $(CONTAINER) /bin/sh