package com.example.demo

import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType

object TaskDefinition : EntityDefinition {
    override val type: EntityType = EntityType("demo.task")
    override val modelClass: Class<*> = Task::class.java
}
