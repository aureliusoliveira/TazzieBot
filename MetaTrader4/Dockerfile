FROM scottyhardy/docker-wine:latest

COPY ./MetaTrader4 /home/Metatrader4
COPY ./entrypoint.sh /usr/bin/entrypoint

RUN mkdir -p /var/logs/MetaTrader4 
RUN ln -s /home/Metatrader4/Tester/logs /var/logs/MetaTrader4 
RUN chmod +x /usr/bin/entrypoint

ENTRYPOINT ["/usr/bin/entrypoint"]