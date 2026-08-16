package com.example.demo

import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType

object ScriptDefinition : EntityDefinition {
    override val type: EntityType = EntityType("demo.script")
    override val modelClass: Class<*> = Script::class.java
}
