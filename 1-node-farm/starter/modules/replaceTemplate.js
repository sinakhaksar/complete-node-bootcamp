module.exports = function (temp, product) {
	let output = temp.replaceAll('{%PRODUCTNAME%}', product.productName);
	output = output.replaceAll('{%IMAGE%}', product.image);
	output = output.replaceAll('{%FROM%}', product.from);
	output = output.replaceAll('{%PRICE%}', product.price);
	output = output.replaceAll('{%QUSNTITY%}', product.quantity);
	output = output.replaceAll('{%NUTRITIONS%}', product.nutrients);
	output = output.replaceAll('{%DISCRIPTION%}', product.description);
	output = output.replaceAll('{%ID%}', product.id);

	if (!product.organic)
		output = output.replaceAll('{%NOT_ORGANIC%}', 'not-organic');
	return output;
};
