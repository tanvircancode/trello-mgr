<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invitations', function (Blueprint $table) {

            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->uuid('invited_user_id');
            $table->string('project_title')->nullable();
            $table->string('token');
            $table->enum('status', ['pending', 'accepted', 'declined']);
            $table->timestamp('expires_at');
            $table->timestamps();


            $table->foreign('project_id')
            ->references('id')->on('projects')
            ->onDelete('cascade');

            $table->foreign('invited_user_id')
            ->references('id')->on('users')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
