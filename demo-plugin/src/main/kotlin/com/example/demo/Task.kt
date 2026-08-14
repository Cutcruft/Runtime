package com.example.demo

import runtime.domain.obj.ObjectRef

data class Task(
    val title: String,
    val status: String,
    val board: ObjectRef? = null
)
