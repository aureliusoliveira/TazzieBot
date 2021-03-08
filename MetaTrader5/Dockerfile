FROM scottyhardy/docker-wine:latest

COPY ./MetaTrader5 /home/Metatrader5
COPY ./entrypoint.sh /usr/bin/entrypoint

RUN mkdir -p /var/logs/MetaTrader5 
RUN ln -s /home/Metatrader5/Tester/logs /var/logs/MetaTrader5 
RUN chmod +x /usr/bin/entrypoint

ENTRYPOINT ["/usr/bin/entrypoint"]