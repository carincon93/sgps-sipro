<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EvaluacionFinalizada extends Notification
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
        $this->proyecto = $proyecto;
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
        $proyecto = $this->proyecto;
        $year = null;
        switch ($proyecto) {
            case $proyecto->idi()->exists():
                $year = date('Y', strtotime($proyecto->idi->fecha_finalizacion));
                break;
            case $proyecto->ta()->exists():
                $year = date('Y', strtotime($proyecto->ta->fecha_finalizacion));
                break;
            case $proyecto->tp()->exists():
                $year = date('Y', strtotime($proyecto->tp->fecha_finalizacion));
                break;
            case $proyecto->culturaInnovacion()->exists():
                $year = date('Y', strtotime($proyecto->culturaInnovacion->fecha_finalizacion));
                break;
            case $proyecto->servicioTecnologico()->exists():
                $year = date('Y', strtotime($proyecto->servicioTecnologico->fecha_finalizacion));
                break;
            default:
                break;
        }
        $message = "El proyecto SGPS-" . (8000 + $this->proyecto->id) . "-" . $year . " ha sido evaluado correctamente. ¡Muchas gracias!.";
        return (new MailMessage)
            ->line($message)
            ->line('Gracias por la atención prestada.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $proyecto = $this->proyecto;
        $year = null;
        switch ($proyecto) {
            case $proyecto->idi()->exists():
                $year = date('Y', strtotime($proyecto->idi->fecha_finalizacion));
                break;
            case $proyecto->ta()->exists():
                $year = date('Y', strtotime($proyecto->ta->fecha_finalizacion));
                break;
            case $proyecto->tp()->exists():
                $year = date('Y', strtotime($proyecto->tp->fecha_finalizacion));
                break;
            case $proyecto->culturaInnovacion()->exists():
                $year = date('Y', strtotime($proyecto->culturaInnovacion->fecha_finalizacion));
                break;
            case $proyecto->servicioTecnologico()->exists():
                $year = date('Y', strtotime($proyecto->servicioTecnologico->fecha_finalizacion));
                break;
            default:
                break;
        }
        $message = "El proyecto SGPS-" . (8000 + $this->proyecto->id) . "-" . $year . " ha sido evaluado correctamente. ¡Muchas gracias!.";
        return [
            "proyectoId"    => $this->proyecto->id,
            "subject"       => "El proyecto ha sido evaluado correctamente",
            "message"       => $message,
        ];
    }
}
