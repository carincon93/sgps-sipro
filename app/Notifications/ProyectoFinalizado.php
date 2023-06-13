<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProyectoFinalizado extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($convocatoria, $proyecto)
    {
        $this->convocatoria = $convocatoria;
        $this->proyecto     = $proyecto;
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
            ->line("El proyecto {$this->proyecto->codigo} ha sido finalizado. Por favor verifique que la información fue diligenciada correctamente haciendo clic en 'Revisar proyecto' y de ser así confirme el proyecto dirigiéndose al último paso 'Finalizar proyecto' y dar clic en 'Confirmar proyecto'.")
            ->action('Revisar proyecto', url("/convocatorias/{$this->convocatoria->id}/proyectos/{$this->proyecto->id}/editar?notificacion={$this->id}"));
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
            "subject"       => "Proyecto se ha finalizado",
            "message"       => "El proyecto {$this->proyecto->codigo} ha sido finalizado. Por favor verifique que la información fue diligenciada correctamente haciendo clic en los tres puntos, luego clic en 'Ver detalles'. Debe hacer la respectiva revisión y de estar todo correcto debe confirmar el proyecto, para hacer esto debe dirigirse al paso de 'Finalizar proyecto' y dar clic en 'Confirmar proyecto'.",
            "action"        => "convocatorias/{$this->convocatoria->id}/proyectos/{$this->proyecto->id}/editar?notificacion={$this->id}"
        ];
    }
}
