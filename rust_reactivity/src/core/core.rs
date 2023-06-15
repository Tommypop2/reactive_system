use std::any::Any;
use std::cmp::PartialEq;
use std::collections::HashSet;
static mut OBSERVER: Option<Computation<()>> = None;
pub struct Computation<T: PartialEq + Copy> {
    pub computation: Option<fn() -> T>,
    pub value: Option<T>,
    pub subsribers: HashSet<Computation<()>>,
    pub dependencies: HashSet<Computation<()>>,
}
impl<T: PartialEq + Copy> Computation<T> {
    pub fn new(comp: fn() -> T) -> Self {
        Computation {
            value: None,
            computation: Some(comp),
            subsribers: HashSet::new(),
            dependencies: HashSet::new(),
        }
    }
    pub fn get(&self) -> &Option<T> {
        return &self.value;
    }
    pub fn set(&mut self, new_value: T) {
        if self.value == Some(new_value) {
            return;
        }
        self.value = Some(new_value);
    }
    fn update(&self) {
        unsafe {
            let prev_observer = OBSERVER;
            OBSERVER = Some(self);
        }
    }
    fn update_subscribers(&self) {
        for item in &self.subsribers {}
    }
}
