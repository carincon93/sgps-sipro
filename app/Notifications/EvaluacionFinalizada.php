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
            case $proyecto->proyectoLinea66()->exists():
                $year = date('Y', strtotime($proyecto->proyectoLinea66->fecha_finalizacion));
                break;
            case $proyecto->proyectoFormulario4Linea70()->exists():
                $year = date('Y', strtotime($proyecto->proyectoFormulario4Linea70->fecha_finalizacion));
                break;
            case $proyecto->proyectoLinea69()->exists():
                $year = date('Y', strtotime($proyecto->proyectoLinea69->fecha_finalizacion));
                break;
            case $proyecto->proyectoLinea65()->exists():
                $year = date('Y', strtotime($proyecto->proyectoLinea65->fecha_finalizacion));
                break;
            case $proyecto->proyectoFormulario12Linea68()->exists():
                $year = date('Y', strtotime($proyecto->proyectoFormulario12Linea68->fecha_finalizacion));
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
            case $proyecto->proyectoLinea66()->exists():
                $year = date('Y', strtotime($proyecto->proyectoLinea66->fecha_finalizacion));
                break;
            case $proyecto->proyectoFormulario4Linea70()->exists():
                $year = date('Y', strtotime($proyecto->proyectoFormulario4Linea70->fecha_finalizacion));
                break;
            case $proyecto->proyectoLinea69()->exists():
                $year = date('Y', strtotime($proyecto->proyectoLinea69->fecha_finalizacion));
                break;
            case $proyecto->proyectoLinea65()->exists():
                $year = date('Y', strtotime($proyecto->proyectoLinea65->fecha_finalizacion));
                break;
            case $proyecto->proyectoFormulario12Linea68()->exists():
                $year = date('Y', strtotime($proyecto->proyectoFormulario12Linea68->fecha_finalizacion));
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
