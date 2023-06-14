#include <iostream>
#include <vector>
#include <functional>
#include <set>
void *current_memo = NULL;
template <typename T>
class Memo
{
public:
    T value;
    std::set<Memo *> subscribers;
    std::set<Memo *> dependencies;
    std::function<T()> computation_ptr = NULL;
    Memo(std::function<T()> computation_ptr)
    {
        this->computation_ptr = computation_ptr;
        this->update();
    }
    ~Memo()
    {
        // Remove the pointer to this instance from all subscribers and dependencies
        for (auto dep : this->dependencies)
        {
            dep->subscribers.erase(this);
        }
        for (auto sub : this->subscribers)
        {
            sub->dependencies.erase(this);
        }
    }
    /**
     * Gets the value of the memo
     */
    get()
    {
        this->track();
        return this->value;
    }
    /**
     * Sets the value of the memo, and updates all subscribers
     */
    set(int newValue)
    {
        if (this->value == newValue)
        {
            return 0;
        }
        this->value = newValue;
        this->notifySubscribers();
        return 0;
    }

private:
    bool dirty = false;
    int depsDirtyCount = 0;
    update()
    {
        void *prevMemo = current_memo;
        current_memo = this;
        auto newValue = this->computation_ptr();
        current_memo = prevMemo;
        this->value = newValue;
        // Mark children as dirty
        for (auto sub : this->subscribers)
        {
            sub->dirty = true;
        }
        this->dirty = false;
        return 0;
    }
    track()
    {
        if (current_memo == NULL)
        {
            return 0;
        }
        Memo *currentMemoPtr = (Memo *)current_memo;
        this->subscribers.insert(currentMemoPtr);
        currentMemoPtr->dependencies.insert(this);
        return 0;
    }
    increment()
    {
        this->depsDirtyCount++;
        if (this->depsDirtyCount == 1)
        {
            for (auto sub : this->subscribers)
            {
                // Update all children as this node has updated
                sub->increment();
            }
        }
        return 0;
    }
    decrement()
    {
        this->depsDirtyCount--;
        if (this->depsDirtyCount == 0)
        {
            if (this->dirty)
            {
                this->update();
            }
            for (auto sub : this->subscribers)
            {
                // Update all children as this node has updated
                sub->decrement();
            }
        }
        return 0;
    }
    /**
     * Notify all subscribers that something has changed, and update them
     */
    notifySubscribers()
    {
        for (auto sub : this->subscribers)
        {
            sub->dirty = true;
            sub->increment();
        }
        for (auto sub : this->subscribers)
        {
            sub->decrement();
        }
        return 0;
    }
};
/// @brief Get the owner of the current computation
/// @return A pointer to the memo which owns the current computation
template <typename T>
Memo<T> *getOwner()
{
    return (Memo<T> *)current_memo;
}
/**
 * Run a computation with a specific owner
 */
template <typename T>
Memo<T> *runWithOwner(void *ownerPtr, std::function<T()> fn)
{
    void *prevMemo = current_memo;
    current_memo = ownerPtr;
    T result = fn();
    current_memo = prevMemo;
    return result;
}
/**
 * Untrack a computation
 */
template <typename T>
T untrack(std::function<T()> computation_ptr)
{
    // Untracking is the same as just running with no owner
    return runWithOwner(NULL, computation_ptr);
}