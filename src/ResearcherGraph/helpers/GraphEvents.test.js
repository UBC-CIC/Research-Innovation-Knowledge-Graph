import getGraphEvents from "./GraphEvents";

test('Node double click event exists and opens correct window', () => {
  const result = getGraphEvents();
  expect(result.doubleClickNode).toBeDefined();
  window.open = jest.fn();
  result.doubleClickNode({node: "A"});
  expect(window.open).toHaveBeenCalledWith('http://localhost:3000/A');
});
