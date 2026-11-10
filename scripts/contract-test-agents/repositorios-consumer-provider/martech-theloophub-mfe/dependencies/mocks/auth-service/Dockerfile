FROM node:18.12

WORKDIR /mocks

COPY auth-endpoints.yaml /mocks/auth-endpoints.yaml
COPY responses /mocks/responses

EXPOSE 80 8906

RUN yarn global add stubby 
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]