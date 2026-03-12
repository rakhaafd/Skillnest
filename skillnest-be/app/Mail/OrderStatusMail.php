<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        $subject = match($this->order->status) {
            'paid'      => 'Pembayaran Dikonfirmasi - Order #' . $this->order->id,
            'completed' => 'Pesanan Selesai - Order #' . $this->order->id,
            'cancelled' => 'Pesanan Dibatalkan - Order #' . $this->order->id,
            default     => 'Update Status Order #' . $this->order->id,
        };

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.order-status');
    }
}