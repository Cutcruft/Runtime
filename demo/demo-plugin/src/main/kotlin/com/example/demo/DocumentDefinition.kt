package com.example.demo

import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType

object DocumentDefinition : EntityDefinition {
    override val type: EntityType = EntityType("demo.document")
    override val modelClass: Class<*> = Document::class.java
}
