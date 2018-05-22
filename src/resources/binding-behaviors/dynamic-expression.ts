import { autoinject } from 'aurelia-dependency-injection';
import { ExpressionCloner, AccessMember, CallMember, Parser } from 'aurelia-binding';

@autoinject()
export class DynamicExpressionBindingBehavior {
  constructor(private parser : Parser) { }

  bind(binding, source, rawExpression) {
    
    // Parse the expression that was passed as a string argument to
    // the binding behavior.
    let expression = this.parser.parse(rawExpression);

    // Rebase the expression
    expression = rebaseExpression(expression, binding.sourceExpression);

    // Squirrel away the binding's original expression so we can restore
    // the binding to it's initial state later.
    binding.originalSourceExpression = binding.sourceExpression;

    // Replace the binding's expression.
    binding.sourceExpression = expression;
  }

  unbind(binding, source) {
    // Restore the binding to it's initial state.
    binding.sourceExpression = binding.originalSourceExpression;
    binding.originalSourceExpression = null;
  }
}

class ExpressionRebaser extends ExpressionCloner {
  base: any;

  constructor(base) {
    super();
    this.base = base;
  }

  visitAccessThis(access) {
    if (access.ancestor !== 0) {
      throw new Error('$parent expressions cannot be rebased.');
    }
    return this.base;
  }

  visitAccessScope(access) {
    if (access.ancestor !== 0) {
      throw new Error('$parent expressions cannot be rebased.');
    }
    return new AccessMember(this.base, access.name);
  }

  visitCallScope(call) {
    if (call.ancestor !== 0) {
      throw new Error('$parent expressions cannot be rebased.');
    }
    return new CallMember(this.base, call.name, this.base.cloneExpressionArray(call.args));
  }
}

function rebaseExpression(expression, baseExpression) {
  let visitor = new ExpressionRebaser(baseExpression);
  return expression.accept(visitor);
}

