<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #fff; padding: 24px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 16px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #9ca3af; }
        .status-badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 14px; }
        .paid { background: #d1fae5; color: #065f46; }
        .completed { background: #dbeafe; color: #1e40af; }
        .cancelled { background: #fee2e2; color: #991b1b; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .info-table td { padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        .info-table td:first-child { color: #6b7280; width: 40%; }
        .info-table td:last-child { font-weight: 600; }
        .cta { background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin:0;">SkillNest</h2>
            <p style="margin:4px 0 0;">Update Status Pesanan</p>
        </div>

        <div class="content">
            <p>Halo <strong>{{ $order->buyer->name }}</strong>,</p>
            <p>Status pesanan kamu telah diperbarui menjadi:</p>

            <span class="status-badge {{ $order->status }}">
                @if($order->status === 'paid') ✅ PEMBAYARAN DIKONFIRMASI
                @elseif($order->status === 'completed') 🎉 PESANAN SELESAI
                @elseif($order->status === 'cancelled') ❌ PESANAN DIBATALKAN
                @else {{ strtoupper($order->status) }}
                @endif
            </span>

            <table class="info-table">
                <tr>
                    <td>Order ID</td>
                    <td>#{{ $order->id }}</td>
                </tr>
                <tr>
                    <td>Item</td>
                    <td>{{ $order->item->name }}</td>
                </tr>
                <tr>
                    <td>Harga</td>
                    <td>Rp {{ number_format($order->price, 0, ',', '.') }}</td>
                </tr>
                <tr>
                    <td>Penjual</td>
                    <td>{{ $order->item->user->name }}</td>
                </tr>
                <tr>
                    <td>Status</td>
                    <td>{{ strtoupper($order->status) }}</td>
                </tr>
            </table>

            @if($order->status === 'completed')
                <div style="margin-top: 20px; padding: 16px; background: #eff6ff; border-radius: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #1e40af;">
                        Pesanan kamu sudah selesai! Jangan lupa berikan ulasan untuk membantu pembeli lain.
                    </p>
                </div>
            @endif

            @if($order->status === 'cancelled')
                <div style="margin-top: 20px; padding: 16px; background: #fef2f2; border-radius: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #991b1b;">
                        Pesanan kamu telah dibatalkan. Silakan hubungi penjual jika ada pertanyaan.
                    </p>
                </div>
            @endif
        </div>

        <div class="footer">
            <p>Email ini dikirim otomatis oleh sistem SkillNest. Jangan balas email ini.</p>
            <p>© 2024 SkillNest. All rights reserved.</p>
        </div>
    </div>
</body>
</html>