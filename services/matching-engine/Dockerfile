FROM alpine:latest

WORKDIR /app

# Copy the pre-built binary
COPY main .

# Ensure it's executable
RUN chmod +x main

CMD ["./main"]
