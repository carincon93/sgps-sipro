<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComentarioProyecto extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($convocatoria, $proyecto, $comentario)
    {
        $this->convocatoria = $convocatoria;
        $this->proyecto = $proyecto;
        $this->comentario = $comentario;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('El proyecto no fue aceptado por el dinamizador SENNOVA. Por favor haga clic en \'Revisar comentario\' y revise en las notificaciones el comentario o recomendación que hizo el dinamizador.')
            ->action('Revisar comentario', url('/notificaciones'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            "proyectoId"    => $this->proyecto->id,
            "subject"       => "El proyecto no fue aceptado por el dinamizador SENNOVA",
            "message"       => $this->comentario,
            "action"        => "convocatorias/{$this->convocatoria->id}/proyectos/{$this->proyecto->id}/editar?notificacion={$this->id}"
        ];
    }
}
