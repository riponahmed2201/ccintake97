<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::unprepared("
                DROP FUNCTION IF EXISTS next_sequence;
                CREATE FUNCTION next_sequence(seq_name VARCHAR(50))
                RETURNS VARCHAR(50)
                DETERMINISTIC
                MODIFIES SQL DATA
                BEGIN
                    DECLARE new_val BIGINT UNSIGNED;
                    DECLARE pfx VARCHAR(20);
                    DECLARE pad TINYINT;
                    
                    INSERT INTO custom_sequences (name, current_val, prefix, padding, created_at, updated_at)
                    VALUES (seq_name, 1, 
                            CASE seq_name WHEN 'member_code' THEN 'M97-' WHEN 'application_no' THEN 'APP97-' ELSE 'SEQ-' END, 
                            4, NOW(), NOW())
                    ON DUPLICATE KEY UPDATE current_val = current_val + 1, updated_at = NOW();

                    SELECT current_val, prefix, padding INTO new_val, pfx, pad FROM custom_sequences WHERE name = seq_name;

                    RETURN CONCAT(pfx, LPAD(new_val, pad, '0'));
                END
            ");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::unprepared("DROP FUNCTION IF EXISTS next_sequence");
        }
    }
};
