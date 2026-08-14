package runtime.domain.obj

import runtime.domain.entity.EntityType
import java.util.concurrent.locks.ReentrantReadWriteLock
import kotlin.concurrent.read
import kotlin.concurrent.write

class SynchronizedObjectList<T>(
    override val entityType: EntityType
) : ObjectList<T> {
    private val store = HashMap<ObjectId, T>()
    private val lock = ReentrantReadWriteLock()

    override fun create(model: T): ObjectRef {
        val identity = ObjectId.generate()
        lock.write { store[identity] = model }
        return ObjectRef(entityType, identity)
    }

    override fun create(objectId: ObjectId, model: T): Boolean {
        return lock.write {
            if (store.containsKey(objectId)) false else {
                store[objectId] = model
                true
            }
        }
    }

    override fun get(objectId: ObjectId): T? = lock.read { store[objectId] }

    override fun update(objectId: ObjectId, model: T): Boolean {
        return lock.write {
            if (store.containsKey(objectId)) {
                store[objectId] = model
                true
            } else {
                false
            }
        }
    }

    override fun delete(objectId: ObjectId): Boolean {
        return lock.write { store.remove(objectId) != null }
    }

    override fun list(): List<ObjectRef> = lock.read { store.keys.map { ObjectRef(entityType, it) } }

    override fun values(): List<T> = lock.read { store.values.toList() }

    override fun size(): Int = lock.read { store.size }
}
