package com.example.demo

import runtime.domain.entity.EntityDefinition
import runtime.domain.entity.EntityType

object BoardDefinition : EntityDefinition {
    override val type: EntityType = EntityType("demo.board")
    override val modelClass: Class<*> = Board::class.java
}
