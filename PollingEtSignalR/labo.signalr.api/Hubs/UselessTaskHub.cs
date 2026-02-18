using labo.signalr.api.Models;
using Microsoft.AspNetCore.SignalR;

namespace labo.signalr.api.Hubs
{
    public class UselessTaskHub : Hub
    {

        private static List<UselessTask> tasks = new List<UselessTask>();
        private static int userCount = 0;
        private static int nextId = 1;
        public async Task AddTask(string taskText)
        {
            // Ajouter la tâche dans la liste
            var task = new UselessTask { Id = nextId++,Text = taskText, Completed = false };
            tasks.Add(task);

            // Déclencher TaskList uniquement pour le client qui a appelé cette méthode
            await Clients.All.SendAsync("TaskList", tasks);

        }
        public async Task CompleteTask(int id)
        {
            var task = tasks.FirstOrDefault(t => t.Id == id);
            if (task != null)
            {
                task.Completed = true;
            }

            
            await Clients.All.SendAsync("TaskList", tasks);
        }

        public override async Task OnConnectedAsync()
        {
            userCount++; // Incrémente le nombre d'utilisateurs actifs
            await Clients.All.SendAsync("UserCount", userCount); // Envoie à tous les clients
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            userCount--; // Décrémente le nombre d'utilisateurs actifs
            await Clients.All.SendAsync("UserCount", userCount); // Envoie à tous les clients
            await base.OnDisconnectedAsync(exception);
        }
    }
}
