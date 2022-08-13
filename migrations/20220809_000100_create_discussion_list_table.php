<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('discussion_list', function (Blueprint $table) {
            $table->unsignedInteger('discussion_id');
            $table->unsignedInteger('list_id');
            $table->unsignedInteger('order')->nullable();
            $table->timestamps();

            $table->primary(['discussion_id', 'list_id']);

            $table->foreign('discussion_id')->references('id')->on('discussions')->onDelete('cascade');
            $table->foreign('list_id')->references('id')->on('discussion_lists')->onDelete('cascade');
        });
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('discussion_list');
    },
];
