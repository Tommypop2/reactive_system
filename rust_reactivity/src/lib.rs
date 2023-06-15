pub mod api;
pub mod core;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        core::core::Computation::new(|| 1);
    }
}
