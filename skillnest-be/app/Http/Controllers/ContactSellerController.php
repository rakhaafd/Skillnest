<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Models\MarketItem;

class ContactSellerController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:market_items,id',
            'buyer_email' => 'required|email',
            'message' => 'required|string',
            'subject' => 'nullable|string|max:255'
        ]);

        // Ambil item + seller
        $item = MarketItem::with('user')->findOrFail($request->item_id);

        $sellerEmail = $item->user->email;

        $subject = $request->subject ?? "Pertanyaan tentang item: {$item->name}";

        $messageContent = "
Item: {$item->name}
Harga: {$item->price}

Email Pembeli: {$request->buyer_email}

Pesan dari calon pembeli:
{$request->message}
";

        Mail::raw($messageContent, function ($mail) use ($sellerEmail, $subject, $request) {
            $mail->to($sellerEmail)
                 ->subject($subject)
                 ->replyTo($request->buyer_email) // seller bisa langsung reply ke buyer
                 ->from(config('mail.from.address'), config('mail.from.name'));
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Email berhasil dikirim ke penjual'
        ]);
    }
}