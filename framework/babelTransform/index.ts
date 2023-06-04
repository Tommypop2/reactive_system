import { PluginOption } from "vite";
import {
	transformAsync,
	PluginObj,
	types,
	NodePath,
	TransformOptions,
} from "@babel/core";
import jsxParser from "@babel/plugin-syntax-jsx";
import ts from "@babel/preset-typescript";
import helperModuleImports from "@babel/helper-module-imports";
function registerImport(path: NodePath<any>, name: string, source: string) {
	return helperModuleImports.addNamed(path, name, source);
}
function jsxElementNameToString(node) {
	if (types.isJSXMemberExpression(node)) {
		return `${jsxElementNameToString(node.object)}.${node.property.name}`;
	}
	if (types.isJSXIdentifier(node) || types.isIdentifier(node)) {
		return node.name;
	}
	return `${node.namespace.name}:${node.name.name}`;
}

function getTagName(tag) {
	const jsxName = tag.openingElement.name;
	return jsxElementNameToString(jsxName);
}
export default function coolPlugin(): PluginOption {
	return {
		name: "cool-plugin",
		enforce: "pre",
		async transform(src, id) {
			if (!id.endsWith(".tsx")) return;
			const opts: TransformOptions = {
				babelrc: false,
				configFile: false,
				root: "main.tsx",
				test: /\.tsx?$/,
				filename: id,
				sourceFileName: id,
				sourceMaps: true,
				inputSourceMap: false as any,
			};
			const transformed = await transformAsync(
				src,
				Object.assign(opts, {
					presets: [ts],
					plugins: [
						jsxParser,
						function customPlugin(): PluginObj {
							return {
								visitor: {
									JSXFragment(path) {
										path.replaceWithMultiple(path.node.children);
									},
									JSXElement(path) {
										const children = path.node.children;
										let createElementArgs: Record<string, any> = [];
										if (types.isJSXOpeningElement(path.node.openingElement)) {
											path.node.openingElement.attributes.forEach((attr) => {
												if (types.isJSXAttribute(attr)) {
													createElementArgs[attr.name.name.toString()] =
														// @ts-ignore
														attr.value.expression;
												}
											});
										}
										for (const child of children) {
											if (types.isJSXExpressionContainer(child)) {
												const expression = child.expression;
												if (types.isCallExpression(expression)) {
													createElementArgs.innerText = expression.callee;
												}
											}
											// Means that this is always overridden by any jsx expression containers
											if (
												types.isJSXText(child) &&
												!("innerText" in createElementArgs)
											) {
												const text = types.stringLiteral(child.value.trim());
												createElementArgs.innerText = text;
											}
										}
										const fnName = registerImport(
											path,
											"createElement",
											"../helpers"
										).name;
										let objectExpressionArr: any[] = [];
										Object.keys(createElementArgs).forEach((key) => {
											objectExpressionArr.push(
												types.objectProperty(
													types.stringLiteral(key),
													createElementArgs[key]
												)
											);
										});

										const callExpression = types.callExpression(
											types.identifier(fnName),
											[
												types.stringLiteral(getTagName(path.node)),
												types.objectExpression(objectExpressionArr),
											]
										);
										path.replaceWith(callExpression);
									},
								},
							};
						},
					],
				})
			);

			return {
				code: transformed!.code!,
				map: transformed!.map!,
			};
		},
	};
}
