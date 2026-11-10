FROM beesmicroservices.azurecr.io/admin-portal-mfe-nginx:latest

COPY ./dist /usr/share/nginx/html/mf/martech-theloophub-mfe/

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
