import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { UselessTask } from '../models/UselessTask';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-signalr',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './signalr.component.html',
  styleUrls: ['./signalr.component.css'],
})
export class SignalrComponent implements OnInit {
  private hubConnection?: signalR.HubConnection;
  usercount = 0;
  tasks: UselessTask[] = [];
  taskname: string = '';

  ngOnInit(): void {
    this.connecttohub();
  }

  connecttohub() {
    // TODO On doit commencer par créer la connexion vers le Hub

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5042/taskHub')
      .build();
    // TODO On peut commencer à écouter pour les évènements qui vont déclencher des callbacks
    this.hubConnection!.on('TaskList', (tasks: UselessTask[]) => {
      this.tasks = tasks;
      // data a le même type que ce qui a été envoyé par le serveur
      console.log('Liste de tâches reçue: ', tasks);
    });

     this.hubConnection!.on('UserCount', (count: number) => {
    this.usercount = count; 
    console.log('Nombre d’utilisateurs connectés:', count);
  });

    // TODO On doit ensuite se connecter
    this.hubConnection
      .start()
      .then(() => {
        console.log('La connexion est active!');
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  }

  complete(id: number) {
    // TODO On invoke la méthode pour compléter une tâche sur le serveur
      this.hubConnection!.invoke('CompleteTask', id)
        .then(() => console.log('Tâche complétée'))
        .catch(err => console.error('Erreur lors de la complétion:', err));
  }

  addtask() {
    // TODO On invoke la méthode pour ajouter une tâche sur le serveur
    if (!this.taskname) return;

    this.hubConnection!.invoke('AddTask', this.taskname).then(() => {
      console.log('Tâche ajoutée avec succès');
      this.taskname = ''; // Reset input
    })
      .catch(err => console.error('Erreur lors de l’ajout de la tâche:', err));
  }


}

