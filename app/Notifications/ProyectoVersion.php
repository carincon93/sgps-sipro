<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProyectoVersion extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($version)
    {
        $this->version = $version;
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
            ->subject('Se ha generado una versión en PDF del proyecto')
            ->line("Se ha generado una versión en PDF del proyecto {$this->version->proyecto->codigo} tras ser finalizado.")
            ->action('Ver proyecto', url("/convocatorias/{$this->version->proyecto->convocatoria->id}/proyectos/{$this->version->proyecto->id}/editar?notificacion={$this->id}"))
            ->line('Recuerde revisar el archivo anexo en PDF!')
            ->attach(storage_path("app/convocatorias/" . $this->version->proyecto->convocatoria->id . "/" . $this->version->proyecto->id . "/" . $this->version->version . ".pdf"));
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
            "proyectoId"    => $this->version->proyecto->id,
            "subject"       => "Se ha generado una versión en PDF del proyecto",
            "message"       => "Se ha generado una versión en PDF del proyecto {$this->version->proyecto->codigo} tras ser finalizado.",
            "action"        => "convocatorias/{$this->version->proyecto->convocatoria->id}/proyectos/{$this->version->proyecto->id}/editar?notificacion={$this->id}"
        ];
    }
}
