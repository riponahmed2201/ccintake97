<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class SequenceService
{
    /**
     * Get the next sequence code for a given sequence name.
     */
    public static function next(string $seqName): string
    {
        if (DB::getDriverName() === 'mysql') {
            try {
                $code = DB::scalar("SELECT next_sequence(?)", [$seqName]);
                if (! empty($code)) {
                    return (string) $code;
                }
            } catch (\Throwable $e) {
                // Fallback to table transaction logic
            }
        }

        return DB::transaction(function () use ($seqName) {
            $prefix = match ($seqName) {
                'member_code' => 'M97-',
                'application_no' => 'APP97-',
                default => 'SEQ-',
            };
            $padding = 4;

            $record = DB::table('custom_sequences')->where('name', $seqName)->lockForUpdate()->first();

            if (! $record) {
                DB::table('custom_sequences')->insert([
                    'name' => $seqName,
                    'current_val' => 1,
                    'prefix' => $prefix,
                    'padding' => $padding,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $val = 1;
            } else {
                $val = $record->current_val + 1;
                $prefix = $record->prefix;
                $padding = $record->padding;
                DB::table('custom_sequences')->where('name', $seqName)->update([
                    'current_val' => $val,
                    'updated_at' => now(),
                ]);
            }

            return $prefix . str_pad((string) $val, $padding, '0', STR_PAD_LEFT);
        });
    }
}
