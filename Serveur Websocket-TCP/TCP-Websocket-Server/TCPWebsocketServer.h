#pragma once

#include <QtWidgets/QMainWindow>
#include "ui_TCPWebsocketServer.h"
#include <qtcpserver.h>
#include <qtcpsocket.h>
#include <QWebSocketServer>
#include <QWebSocket>
#include <QJsonObject>
#include <QJsonDocument>
#include <QSqlDatabase>
#include <QSqlQuery>
#include <qmap.h>
#include "ClientState.h"

class TCPWebsocketServer : public QMainWindow
{
    Q_OBJECT

public:
    TCPWebsocketServer(QWidget *parent = nullptr);
    ~TCPWebsocketServer();

private:
    Ui::TCPWebsocketServerClass ui;
    QTcpServer* TCPserver;
    QWebSocketServer* webSocketServer;
    QSqlDatabase db;


	QMap<QWebSocket*, ClientState*> clients;

    //std::vector<QTcpSocket*> clientsTCP; // Listes des clients application
    //std::vector<QWebSocket*> clientsWeb; // Listes des clients web

public slots:
    void onServerNewConnection(); // Connexion client
    void onClientDisconnected(); // Deconnexion client
    void onClientReadyRead(); // Reception message client application
    void onWebClientReadyRead(const QString& message); // Reception message client web
    void onSendMessageButtonClicked(QTcpSocket* obj, QWebSocket* objWeb, QString messageReceived); // Envoie message client
};
